import React, { useCallback } from 'react';
import { Tag, Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from '@carbon/react/icons';
import { navigate, useConfig } from '@openmrs/esm-framework';
import { DiagnosisItem, Note } from '../../types/index';
import styles from './triage-note.scss';
import { launchPatientChartWithWorkspaceOpen } from '../../workspaces/workspaces';
import { ConfigObject } from '../../config-schema';
import { launchFormEntry } from '../../workspaces/launchFormEntry';

interface TriageNoteProps {
  notes: Array<Note>;
  diagnoses: Array<DiagnosisItem>;
  patientUuid: string;
}

const TriageNote: React.FC<TriageNoteProps> = ({ notes, patientUuid, diagnoses }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const handleOpenTriageForm = useCallback(() => {
    if (config.vitalsForm.useFormEngine) {
      launchFormEntry(config.vitalsForm.formUuid, '', config.vitalsForm.formName);
    } else {
      launchPatientChartWithWorkspaceOpen({
        patientUuid: patientUuid,
        workspaceName: config.vitalsForm.vitalsFormWorkspace,
        dashboardName: null,
        additionalProps: {
          workspaceTitle: 'HTS Client Tracing Form',
        },
      });
    }
    navigate({
      to: `\${openmrsSpaBase}/patient/${patientUuid}/chart`,
    });
  }, [
    config.vitalsForm.formName,
    config.vitalsForm.formUuid,
    config.vitalsForm.useFormEngine,
    config.vitalsForm.vitalsFormWorkspace,
    patientUuid,
  ]);

  return (
    <div>
      {diagnoses.length > 0
        ? diagnoses.map((d: DiagnosisItem, ind) => (
            <Tag type="blue" size="md">
              {d.diagnosis}
            </Tag>
          ))
        : null}
      {notes.length ? (
        notes.map((note: Note, i) => (
          <div>
            <p>{note.note}</p>
            <p className={styles.subHeading}>
              {note.provider.name ? <span> {note.provider.name} </span> : null} · {note.time}
            </p>
          </div>
        ))
      ) : (
        <div>
          <p className={styles.emptyText}>{t('tirageNotYetCompleted', 'Triage has not yet been completed')}</p>
          <Button
            size="small"
            kind="ghost"
            renderIcon={(props) => <ArrowRight size={16} {...props} />}
            onClick={handleOpenTriageForm}
            iconDescription={t('triageForm', 'Triage form')}>
            {t('triageForm', 'Triage form')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TriageNote;
