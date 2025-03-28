
import { format, isValid, parseISO } from 'date-fns';

export const formatDate = (dateString: string) => {
  try {
    // Try to parse the date - handle both ISO strings and Firestore timestamp formats
    const date = parseISO(dateString);
    
    // Check if the date is valid
    if (isValid(date)) {
      return format(date, 'PPP');
    }
    
    // If parseISO fails, try regular Date constructor
    const fallbackDate = new Date(dateString);
    if (isValid(fallbackDate)) {
      return format(fallbackDate, 'PPP');
    }
    
    return 'Invalid date';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatTime = (dateString: string) => {
  try {
    // Try to parse the date - handle both ISO strings and Firestore timestamp formats
    const date = parseISO(dateString);
    
    // Check if the date is valid
    if (isValid(date)) {
      return format(date, 'p');
    }
    
    // If parseISO fails, try regular Date constructor
    const fallbackDate = new Date(dateString);
    if (isValid(fallbackDate)) {
      return format(fallbackDate, 'p');
    }
    
    return '';
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};
