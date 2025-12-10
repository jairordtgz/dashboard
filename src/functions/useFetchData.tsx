import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
    Guayaquil: { lat: -2.1962, lon: -79.8862 },
    Quito: { lat: -0.2298, lon: -78.525 },
    Manta: { lat: -0.9494, lon: -80.7314 },
    Cuenca: { lat: -2.9005, lon: -79.0045 }
};

export default function useFetchData(selectedOption: string | null) {

    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            setError("");

            try {
                const city = selectedOption ?? "Guayaquil";
                const { lat, lon } = CITY_COORDS[city];

                const URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`;

                const response = await fetch(URL);

                if (!response.ok) throw new Error("Error al obtener los datos");

                const json: OpenMeteoResponse = await response.json();
                setData(json);

            } catch (err) {
                console.error("Fetch error:", err);
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [selectedOption]); // Se ejecuta cada vez que cambia la ciudad

    return { data, loading, error };
}
