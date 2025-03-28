
import { format } from 'date-fns';

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'PPP');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'p');
  } catch (error) {
    return '';
  }
};
