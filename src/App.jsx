import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import './styles.css';

const App = () => {

    const [data, setData] = useState([]);
    const [dataOrganization, setDataOrganization] = useState([]);

    const [ucid, setUcid] = useState('');
    const [input, setInput] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState(false);

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const ucidParam = searchParams.get('uui')

    useEffect(() => {
        setUcid(ucidParam);
    }, [ucidParam]);

    //Get token 
    const getToken = async () => {

        const url = `https://tpclient-011.bue.tpsouth.corp/webapibot/api/login/validarCti`;

        const axiosInstance = axios.create({
            timeout: 50000,
        });

        await axiosInstance({
            baseURL: url,
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                userToValidate: 'usrCti',
                passwordToValidate: '2B2C6EECC6EACCE8836A4BA27955F'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    if (data) {
                        setToken(data.token);
                    }
                }
            })
            .catch(() => {
                setError(true);
            });
    }

    //Get all the data from the API GetDataByUCID
    const getData = async () => {
        const url = 'https://tpclient-011.bue.tpsouth.corp/webapibot/api/ucid/GetCallData?ucid=' + ucidParam;
        const axiosInstance = axios.create({
            timeout: 50000,
        });

        await axiosInstance({
            baseURL: url,
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    if (data) {
                        setData(data);
                        setInput(data.data.split('|')[0].split(':')[1].trim());
                    }
                }
            })
            .catch(() => {
                setError(true);
            }
            );
    }

    const getDataInZendesk = async (cuit) => {
        const url = 'https://ab-inbevar.zendesk.com/api/v2/search?query=type:organization tax_id:' + cuit;
        console.log(url);
        const axiosInstance = axios.create({
            timeout: 50000,
        });

        await axiosInstance({
            baseURL: url,
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 5eb399c6a8f314e62eb7cc0762b806233ec66997e4fb45e9212f75121cab1eeb`,
            },
        })

            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    if (data) {
                        setDataOrganization(data);
                    }
                }
            })
            .catch(() => {
                setError(true);
            }
            );
    }



    const submitAction = (e) => {
        e.preventDefault();
        getDataInZendesk(input);
        setInput('');
    }

    useEffect(() => {
        getToken();
    }, [])

    useEffect(() => {
        getToken();
        token.length ? getData() : setError(true);
    }, [token]);

    useEffect(() => {
        getToken();
        getData();
    }, []);

    useEffect(() => {
        if (input.length >= 11) {
            getDataInZendesk(input);
        }
    }, [input]);

    const notify = () => toast('Texto copiado', {
        duration: 3000,
        position: 'top-center',
        style: {
            background: '#337AB7',
            color: '#fff',
        },
        className: '',
        ariaProps: {
            role: 'status',
            'aria-live': 'polite',
        },
    });;


    return (
        <div className='container-fluid'>
            <div className='container__header bg-primary'>
                <div className='text-center bg-secondary'>
                    <h4>Información del cliente</h4>
                </div>
                <p className='text-center'>
                    {
                        data.data ? data.data : 'No encontramos registros'
                    }
                </p>
            </div>
            <div>
                {
                    dataOrganization.results && data.data ?
                        dataOrganization.results.map((organization, i) => {
                            return (
                                <div key={i} className="container-fluid container__info">
                                        <div>
                                            <div>
                                                <h3>Información del cliente</h3>
                                            </div>
                                            <ul>
                                                <li className='list__element'>
                                                    <span className='clipboardId'><b>id:</b> {organization.id}</span>
                                                    <CopyToClipboard text={organization.id}>
                                                        <button className='btn btn--copy btn-primary btn-sm' onClick={notify}>Copiar</button>
                                                    </CopyToClipboard>
                                                </li>
                                                <li className='list__element'>
                                                    <span className='clipboardCuit'><b>Código de cliente:</b> {organization.external_id}</span>
                                                    <CopyToClipboard text={organization.organization_fields.tax_id}>
                                                        <button className='btn btn--copy btn-primary btn-sm' onClick={notify}>Copiar</button>
                                                    </CopyToClipboard>
                                                </li>
                                                <li className='list__element'>
                                                    <span className='clipboardName'>  <b>Nombre:</b> {organization.organization_fields.poc_name}</span>
                                                    <CopyToClipboard text={organization.organization_fields.poc_name}>
                                                        <button className='btn btn--copy btn-primary btn-sm' onClick={notify}>Copiar</button>
                                                    </CopyToClipboard>
                                                </li>
                                            </ul>
                                            <Toaster />
                                        </div>
                                        <div>
                                            <div>
                                                <p>Información adicional</p>
                                            </div>
                                            <hr />
                                            <h4><b>{data.comments}</b></h4>
                                        </div>
                                    </div>
                            )
                        }) : null
                }
            </div>
            {
                !data.data &&
                <div className='container-fluid container__data'>
                    <div className='bg-secondary' >
                        <form onSubmit={submitAction} className='text-center form-inline'>
                            <div className='form-group'>
                                <p>Buscar por número de cuit</p>
                                <label htmlFor="cuit" className='sr-only'>CUIT: </label>
                                <div>
                                    <input
                                        className="form-control"
                                        type="number" placeholder="Número de CUIT"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='boton'>
                                <button type='submit' className="btn btn-primary"> Consultar </button>
                            </div>
                            <hr />
                        </form>
                        <div className="container__input" >
                            <div>

                                {
                                    dataOrganization.results ?
                                        dataOrganization.results.map((organization, i) => {
                                            return (
                                                <div key={i} className="container-fluid container__info">
                                                    <div>
                                                        <div>
                                                            <p>Información del cliente</p>
                                                        </div>
                                                        <hr />
                                                        <ul>
                                                            <li className='list__element'>
                                                                <span className='clipboardId'><b>id:</b> {organization.id}</span>
                                                                <CopyToClipboard text={organization.id}>
                                                                    <button className='btn btn--copy btn-primary btn-sm' onClick={notify}>Copiar</button>
                                                                </CopyToClipboard>
                                                            </li>
                                                            <li className='list__element'>
                                                                <span className='clipboardCuit'><b>Código de cliente:</b> {organization.external_id}</span>
                                                                <CopyToClipboard text={organization.organization_fields.tax_id}>
                                                                    <button className='btn btn--copy btn-primary btn-sm' onClick={notify}>Copiar</button>
                                                                </CopyToClipboard>
                                                            </li>
                                                            <li className='list__element'>
                                                                <span className='clipboardName'>  <b>Nombre:</b> {organization.organization_fields.poc_name}</span>
                                                                <CopyToClipboard text={organization.organization_fields.poc_name}>
                                                                    <button className='btn btn--copy btn-primary btn-sm' onClick={notify}>Copiar</button>
                                                                </CopyToClipboard>
                                                            </li>
                                                        </ul>
                                                        <Toaster />
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p>Información adicional</p>
                                                        </div>
                                                        <hr />
                                                        <h4><b>{data.comments}</b></h4>
                                                    </div>
                                                </div>
                                            )
                                        }) :
                                        'No se realizó ninguna consulta'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default App;