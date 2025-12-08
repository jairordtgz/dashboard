import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

export default function useFetchData(){ 

    const  URL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature&timezone=America%2FChicago';

    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            setLoading(true); 
            setError(""); 

            try {

                const response = await fetch(URL);
                if (!response.ok) throw new Error("Error al obtener los datos");
                const json: OpenMeteoResponse = await response.json();
                setData(json);

            } catch (error) {
                console.error("Fetch error:", error);
            } finally{
                setLoading(false); 
            }
        }

        fetchData(); 
     }, []); // El array vacío asegura que el efecto se ejecute solo una vez después del primer renderizado

    return {data, loading, error};
}