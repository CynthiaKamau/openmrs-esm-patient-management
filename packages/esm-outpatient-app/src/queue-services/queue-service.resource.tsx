import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { FetchResponse, openmrsFetch, useConfig } from '@openmrs/esm-framework';

export function useServiceConcepts() {
  const config = useConfig();
  const {
    concepts: { serviceConceptSetUuid },
  } = config;

  const apiUrl = `/ws/rest/v1/concept/${serviceConceptSetUuid}`;
  const { data, error } = useSWRImmutable<FetchResponse>(apiUrl, openmrsFetch);

  return {
    serviceConcepts: data ? data?.data?.setMembers : [],
    isLoading: !data && !error,
  };
}

export function saveQueue(
  serviceName: string,
  serviceConcept: string,
  serviceDescription: string,
  serviceLocation: string,
  abortController: AbortController,
) {
  return openmrsFetch(`/ws/rest/v1/queue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      name: serviceName,
      description: serviceDescription,
      service: { uuid: serviceConcept },
      location: {
        uuid: serviceLocation,
      },
    },
  });
}
