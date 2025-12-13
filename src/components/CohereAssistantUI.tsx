import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, CircularProgress, Box } from '@mui/material';
import CohereAssistant from '../functions/CohereAssistant';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

const CohereAssistantUI: React.FC<{ city: string; weatherData?: OpenMeteoResponse | null }> = ({ city, weatherData }) => {
  const [query, setQuery] = useState<string>('¿Cómo está el clima actualmente? ¿Algún riesgo de lluvia?');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const sendQuery = async () => {
    setLoading(true);
    setError('');
    try {
      const reply = await CohereAssistant.queryWeather(city, weatherData ?? {}, query);
      setResponse(reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, minWidth: 320 }} elevation={2}>
      <Typography variant="h6" gutterBottom>Asistente de Clima</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>Consulta rápida al modelo Cohere con el estado del tiempo de {city}.</Typography>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe una pregunta sobre el clima, por ejemplo: '¿Necesito paraguas hoy?'"
        sx={{ mt: 1, mb: 1 }}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button variant="contained" onClick={sendQuery} disabled={loading}>
          Consultar
        </Button>
        {loading && <CircularProgress size={20} />}
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
      )}

      {response && (
        <Paper sx={{ mt: 2, p: 2, backgroundColor: '#fafafa' }}>
          <Typography variant="subtitle2">Respuesta del asistente</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{response}</Typography>
        </Paper>
      )}
    </Paper>
  );
}

export default CohereAssistantUI;
