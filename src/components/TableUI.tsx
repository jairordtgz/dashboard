import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { type OpenMeteoResponse } from "../types/DashboardTypes";

function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
   return arrLabels.map((label, index) => ({
      id: index,
      label: label,
      value1: arrValues1[index],
      value2: arrValues2[index]
   }));
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 90 },
   { field: 'label', headerName: 'Hora', width: 125 },
   { field: 'value1', headerName: 'Temperatura (°C)', width: 125 },
   { field: 'value2', headerName: 'Viento (km/h)', width: 125 },
   {
      field: 'resumen',
      headerName: 'Resumen',
      sortable: false,
      hideable: false,
      width: 200,
      valueGetter: (_, row) =>
         `${row.label || ''} - ${row.value1 || ''}°C - ${row.value2 || ''}km/h`,
   },
];

interface TableUIProps {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string;
}

export default function TableUI({ data, loading, error }: TableUIProps) {

   if (loading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error || !data?.hourly) {
      return <Typography color="error">Error al cargar datos climáticos.</Typography>;
   }

   const arrLabels = data.hourly.time.slice(0, 24).map(time => {
      const date = new Date(time);
      return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
   });

   const arrValues1 = data.hourly.temperature_2m.slice(0, 24);
   const arrValues2 = data.hourly.wind_speed_10m.slice(0, 24);

   const rows = combineArrays(arrLabels, arrValues1, arrValues2);

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: { pageSize: 5 },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}
