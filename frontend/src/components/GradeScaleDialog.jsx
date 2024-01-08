import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  Box,
} from "@mui/material";

const GradeScaleDialog = ({ open, onClose, compositions }) => {
  return (
    <Dialog open={open} onClose={onClose} keepMounted>
      <DialogTitle>Grade Calculation</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Grade is calculated based on percentage of compositions
        </Typography>
        <Box display="flex" flexDirection="column" alignContent='flex-start' justifyContent='flex-start'>
          {compositions?.map((c) => (
            <Stack key={c._id} flexDirection='row' justifyContent='flex-start'>
              <Typography sx={{fontWeight: '500'}}>{c?.name}</Typography>
              <Typography sx={{fontWeight: '500', ml: 2}}>{c?.gradeScale}%</Typography>
            </Stack>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{mr: 3}}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GradeScaleDialog;
