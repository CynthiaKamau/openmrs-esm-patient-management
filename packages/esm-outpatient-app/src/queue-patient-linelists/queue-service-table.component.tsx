import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import QueuePatientBaseTable from './queue-linelist-base-table.component';
import Group16 from '@carbon/icons-react/es/group/16';
import InProgress16 from '@carbon/icons-react/es/in-progress/16';
import {
  QueueStatus,
  QueueService,
  MappedQueuePriority,
  getOriginFromPathName,
} from '../active-visits/active-visits-table.resource';
import { formatDatetime, parseDate, usePagination, ConfigurableLink } from '@openmrs/esm-framework';
import styles from './queue-service-table.scss';
import { TooltipDefinition, Tag } from 'carbon-components-react';
import { mockVisitQueueEntries } from '../../__mocks__/active-visits.mock';

const currentPathName: string = window.location.pathname;
const fromPage: string = getOriginFromPathName(currentPathName);

function StatusIcon({ status }) {
  switch (status as QueueStatus) {
    case 'Waiting':
      return <InProgress16 />;
    case 'In Service':
      return <Group16 />;
    default:
      return null;
  }
}

const pageSize = 20;

const ServicesTable: React.FC = () => {
  const { t } = useTranslation();
  const { results: paginatedEntries, currentPage, goTo } = usePagination(mockVisitQueueEntries, pageSize);

  const getTagType = (priority: string) => {
    switch (priority as MappedQueuePriority) {
      case 'Emergency':
        return 'red';
      case 'Not Urgent':
        return 'green';
      default:
        return 'gray';
    }
  };

  const buildStatusString = (status: QueueStatus, service: QueueService) => {
    if (!status || !service) {
      return '';
    }

    if (status === 'Waiting') {
      return `${status} for ${service}`;
    } else if (status === 'In Service') {
      return `Attending ${service}`;
    }
  };

  const tableHeaders = useMemo(
    () => [
      {
        id: 0,
        header: t('name', 'Name'),
        key: 'name',
      },
      {
        id: 1,
        header: t('lastSeen', 'Last Seen'),
        key: 'lastSeen',
      },
      {
        id: 2,
        header: t('visitType', 'Visit Type'),
        key: 'visitType',
      },
      {
        id: 3,
        header: t('priority', 'Priority'),
        key: 'priority',
      },
      {
        id: 4,
        header: t('status', 'Status'),
        key: 'status',
      },
      {
        id: 5,
        header: t('waitTime', 'Wait Time'),
        key: 'waitTime',
      },
      {
        id: 6,
        header: t('gender', 'Gender'),
        key: 'gender',
      },
      {
        id: 7,
        header: t('age', 'Age'),
        key: 'age',
      },
    ],
    [t],
  );

  const tableRows = useMemo(
    () =>
      paginatedEntries?.map((visit) => {
        return {
          id: visit.uuid,
          name: {
            content: (
              <ConfigurableLink to={`\${openmrsSpaBase}/patient/${visit.queueEntry.patient.uuid}/chart`}>
                {visit.queueEntry.display}
              </ConfigurableLink>
            ),
          },
          lastSeen: formatDatetime(parseDate(visit.queueEntry.startedAt.toString()), { mode: 'wide' }),
          visitType: visit.visit.display,
          priority: {
            content: (
              <>
                {visit.queueEntry.priorityComment ? (
                  <TooltipDefinition
                    className={styles.tooltip}
                    align="start"
                    direction="bottom"
                    tooltipText={visit.queueEntry.priorityComment}>
                    <Tag
                      className={visit.queueEntry.priority.display === 'Priority' ? styles.priorityTag : styles.tag}
                      type={getTagType(visit.queueEntry.priority.display as string)}>
                      {visit.queueEntry.priority.display}
                    </Tag>
                  </TooltipDefinition>
                ) : (
                  <Tag
                    className={visit.queueEntry.priority.display === 'Priority' ? styles.priorityTag : styles.tag}
                    type={getTagType(visit.queueEntry.priority.display as string)}>
                    {visit.queueEntry.priority.display}
                  </Tag>
                )}
              </>
            ),
          },
          status: {
            content: (
              <span className={styles.statusContainer}>
                <StatusIcon status={visit.queueEntry.status} />
                <span>{buildStatusString('In Service', 'Clinical consultation')}</span>
              </span>
            ),
          },
          waitTime: visit.queueEntry.sortWeight,
          gender: visit.queueEntry.patient?.display,
          age: visit.queueEntry.patient?.display,
        };
      }),
    [paginatedEntries],
  );

  return (
    <div>
      <QueuePatientBaseTable
        title={t('linelistTableTitle', 'A list of patients waiting for ')}
        headers={tableHeaders}
        rows={tableRows}
        patientData={paginatedEntries}
        serviceType={fromPage}
      />
    </div>
  );
};

export default ServicesTable;
