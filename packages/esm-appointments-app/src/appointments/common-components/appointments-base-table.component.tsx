import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataTableSkeleton,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableHeader,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow,
  Pagination,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
} from '@carbon/react';
import { ConfigurableLink, formatDatetime, usePagination, formatDate } from '@openmrs/esm-framework';
import startCase from 'lodash-es/startCase';
import { Download } from '@carbon/react/icons';
import AppointmentDetails from '../details/appointment-details.component';
import { EmptyState } from '../../empty-state/empty-state.component';
import { downloadAppointmentsAsExcel } from '../../helpers/excel';
import { launchOverlay } from '../../hooks/useOverlay';
import PatientSearch from '../../patient-search/patient-search.component';
import { MappedAppointment } from '../../types';
import { getPageSizes, useSearchResults } from '../utils';
import AppointmentActions from './appointments-actions.component';
import styles from './appointments-base-table.scss';

interface AppointmentsBaseTableProps {
  appointments: Array<MappedAppointment>;
  isLoading: boolean;
  tableHeading: string;
  mutate?: () => void;
  visits?: Array<any>;
  scheduleType?: string;
}

const AppointmentsBaseTable: React.FC<AppointmentsBaseTableProps> = ({
  appointments,
  isLoading,
  tableHeading,
  visits,
  scheduleType,
}) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(25);
  const [searchString, setSearchString] = useState('');
  const searchResults = useSearchResults(appointments, searchString);
  const { results, goTo, currentPage } = usePagination(searchResults, pageSize);

  const headerData = [
    {
      header: t('patientName', 'Patient name'),
      key: 'patientName',
    },
    {
      header: t('nextAppointmentDate', 'Next appointment date'),
      key: 'nextAppointmentDate',
    },
    {
      header: t('dateTime', 'Date & Time'),
      key: 'dateTime',
    },
    {
      header: t('serviceType', 'Service Type'),
      key: 'serviceType',
    },
    {
      header: t('actions', 'Actions'),
      key: 'actions',
    },
  ];

  const rowData = results?.map((appointment, index) => ({
    id: `${index}`,
    patientName: (
      <ConfigurableLink
        style={{ textDecoration: 'none', maxWidth: '50%' }}
        to={`\${openmrsSpaBase}/patient/${appointment.patientUuid}/chart`}>
        {appointment.name}
      </ConfigurableLink>
    ),
    nextAppointmentDate: '--',
    identifier: appointment.identifier,
    dateTime: formatDatetime(new Date(appointment.dateTime)),
    serviceType: appointment.serviceType,
    provider: appointment.provider,
    actions: <AppointmentActions visits={visits} appointment={appointment} scheduleType={scheduleType} />,
  }));

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" row={5} />;
  }

  if (!appointments?.length) {
    return (
      <EmptyState
        headerTitle={`${tableHeading} appointments`}
        displayText={`${tableHeading.toLowerCase()} appointments`}
        launchForm={() => launchOverlay(t('search', 'Search'), <PatientSearch />)}
        scheduleType={scheduleType}
      />
    );
  }

  return (
    <>
      <DataTable rows={rowData} headers={headerData} isSortable>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getToolbarProps, getTableContainerProps }) => (
          <TableContainer
            title={`${startCase(tableHeading)} ${t('appointments', 'appointment')}`}
            description={`${t(`Total ${appointments.length ?? 0}`)}`}
            {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
              <TableToolbarContent>
                <TableToolbarSearch
                  style={{ backgroundColor: '#f4f4f4' }}
                  onChange={(event) => setSearchString(event.target.value)}
                />
                <Button
                  size="lg"
                  kind="tertiary"
                  renderIcon={Download}
                  onClick={() =>
                    downloadAppointmentsAsExcel(
                      appointments,
                      `${tableHeading} Appointments ${formatDate(new Date(appointments[0]?.dateTime), { year: true })}`,
                    )
                  }>
                  {t('download', 'Download')}
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableExpandHeader />
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableExpandRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                      ))}
                    </TableExpandRow>
                    {row.isExpanded && (
                      <TableExpandedRow colSpan={headers.length + 1}>
                        <AppointmentDetails appointment={appointments[row.id]} />
                      </TableExpandedRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <Pagination
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Items per page:"
        page={currentPage}
        pageNumberText="Page Number"
        pageSize={pageSize}
        onChange={({ page, pageSize }) => {
          goTo(page);
          setPageSize(pageSize);
        }}
        pageSizes={getPageSizes(appointments, pageSize) ?? []}
        totalItems={appointments.length ?? 0}
      />
    </>
  );
};

export default AppointmentsBaseTable;
