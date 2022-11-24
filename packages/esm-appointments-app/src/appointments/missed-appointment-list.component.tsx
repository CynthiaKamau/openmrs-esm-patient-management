import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, Tabs, TabPanel, TabPanels } from '@carbon/react';
import MissedAppointments from '../appointments-tabs/missed-appointments.component';
import styles from './missed-appointment-list.scss';

enum MissedAppointmentTypes {
  MISSED = 'Scheduled',
  DEFAULTERS = 'Defaulters',
  LTFU = 'Ltfu',
  PROMISED = 'Promised',
}

const MissedAppointmentList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.appointmentList}>
      <h3 className={styles.heading}>{t('missedAppointmentsList', 'Missed Appointments List')}</h3>

      <div className={styles.wrapper}>
        <Tabs className={styles.tabs}>
          <TabList aria-label="Appointment tabs" contained>
            <Tab>{t('missed', 'Missed')}</Tab>
            <Tab>{t('defaulters', 'Defaulters')}</Tab>
            <Tab>{t('lostToFollowUp', 'Lost To Follow Up')}</Tab>
            <Tab>{t('promisedPatients', 'Promised Patients')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <MissedAppointments status={MissedAppointmentTypes.MISSED} />
            </TabPanel>
            <TabPanel>
              <MissedAppointments status={MissedAppointmentTypes.DEFAULTERS} />
            </TabPanel>
            <TabPanel>{<MissedAppointments status={MissedAppointmentTypes.LTFU} />}</TabPanel>
            <TabPanel>{<MissedAppointments status={MissedAppointmentTypes.PROMISED} />}</TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default MissedAppointmentList;
