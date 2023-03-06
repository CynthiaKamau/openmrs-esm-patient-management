import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { useAppointmentDate } from '../helpers';

interface UnScheduleAppointmentResponse {
  age: number;
  dob: number;
  gender: string;
  identifier: string;
  name: string;
  uuid: string;
  phoneNumber: string;
}

export function useUnScheduleAppointments() {
  const fromData = useAppointmentDate();
  const url = `/ws/rest/v1/appointment/unScheduledAppointment?forDate=${fromData}`;
  const { data, error } = useSWR<{ data: Array<UnScheduleAppointmentResponse> }>(url, openmrsFetch);
  return { isLoading: !data && !error, data: data?.data ?? [], error };
}
