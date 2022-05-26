import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryParams } from './hooks/useQueryParams.ts';

function App () {
    const history = useNavigate();
    const queries = useQueryParams();

    function handleParams () {
        //get api data  
        history('/?id=123&name=Matias');
    }

    return (
        <>  
            {queries['id'] !== undefined && <strong>UID: {queries['id']}</strong>}
            <h1>Datos del usuario: {queries['name']}</h1>
            <button type='button' onClick={handleParams}>Get params</button>
        </>
    )
}
export default App;