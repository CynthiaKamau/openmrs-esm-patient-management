import { AppointmentSummary, QueueServiceInfo } from '../types';
import { getGlobalStore } from '@openmrs/esm-framework';
import { useEffect, useState } from 'react';

export const getServiceCountByAppointmentType = (
  appointmentSummary: Array<AppointmentSummary>,
  appointmentType: string,
) => {
  return appointmentSummary
    .map((el) => Object.entries(el.appointmentCountMap).flatMap((el) => el[1][appointmentType]))
    .flat(1)
    .reduce((count, val) => count + val, 0);
};

const initialServiceNameState = { serviceName: '' };
const initialServiceUuidState = { serviceUuid: '' };
const initialLocationUuidState = { locationUuid: '' };

export function getSelectedServiceName() {
  return getGlobalStore<{ serviceName: string }>('queueSelectedServiceName', initialServiceNameState);
}

export function getSelectedServiceUuid() {
  return getGlobalStore<{ serviceUuid: string }>('queueSelectedServiceUuid', initialServiceUuidState);
}

export function getSelectedLocationUuid() {
  return getGlobalStore<{ locationUuid: string }>('locationSelectedServiceUuid', initialLocationUuidState);
}

export const updateSelectedServiceName = (currentServiceName: string) => {
  const store = getSelectedServiceName();
  store.setState({ serviceName: currentServiceName });
};

export const updateSelectedServiceUuid = (currentServiceUuid: string) => {
  const store = getSelectedServiceUuid();
  store.setState({ serviceUuid: currentServiceUuid });
};

export const updateSelectedLocationUuid = (currentLocationUuid: string) => {
  const store = getSelectedLocationUuid();
  store.setState({ locationUuid: currentLocationUuid });
};

export const useSelectedServiceName = () => {
  const [currentServiceName, setCurrentServiceName] = useState(initialServiceNameState.serviceName);

  useEffect(() => {
    getSelectedServiceName().subscribe(({ serviceName }) => setCurrentServiceName(serviceName));
  }, []);
  return currentServiceName;
};

export const useSelectedServiceUuid = () => {
  const [currentServiceUuid, setCurrentServiceUuid] = useState(initialServiceUuidState.serviceUuid);

  useEffect(() => {
    getSelectedServiceUuid().subscribe(({ serviceUuid }) => setCurrentServiceUuid(serviceUuid));
  }, []);
  return currentServiceUuid;
};

export const useSelectedLocatioUuid = () => {
  const [currentLocationUuid, setCurrentLocationUuid] = useState(initialLocationUuidState.locationUuid);

  useEffect(() => {
    getSelectedLocationUuid().subscribe(({ locationUuid }) => setCurrentLocationUuid(locationUuid));
  }, []);
  return currentLocationUuid;
};
