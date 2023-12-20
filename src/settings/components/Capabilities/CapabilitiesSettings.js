import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { MultiColumnList, Headline } from '@folio/stripes/components';

import { getApplicationName } from '../../utils';
import { CheckboxWithAsterisk } from '../../../components/CheckboxWithAsterisk/CheckboxWithAsterisk';
import { capabilitiesPropType } from '../../types';
import { columnTranslations } from '../../../constants/translations';
import { useCheckboxAriaStates } from './helpers';

import css from '../../style.css';

const CapabilitiesSettings = ({ content, readOnly, onChangeCapabilityCheckbox, isCapabilitySelected }) => {
  const { formatMessage } = useIntl();
  const { getCheckboxAriaLabel } = useCheckboxAriaStates();

  const columnMapping = {
    application: formatMessage(columnTranslations.application),
    resource:formatMessage(columnTranslations.resource),
    view: formatMessage(columnTranslations.view),
    edit: formatMessage(columnTranslations.edit),
    manage: formatMessage(columnTranslations.manage),
    // policies: formatMessage(columnTranslations.policies
  };
  /**
   * Renders an action checkbox for an item.
   *
   * @param {Object} item - The capability item object.
   * @param {string} action - The action to render checkbox for action(e.g. 'view').
   * @return {JSX.Element} By requirements on non-readonly mode we should hide the checkboxes on
   * not related actions. Since every capability have only one action
   * (e.g. {...capability, action: 'view'}),
   * show only checkbox for that particular action.
   * If readOnly mode we should show the checkbox for all actions.
   */

  const renderItemActionCheckbox = (item, action) => {
    if (!readOnly && item.action !== action) return null;
    return <CheckboxWithAsterisk
      aria-describedby="asterisk-policy-desc"
      aria-label={getCheckboxAriaLabel(action, item.resource)}
      onChange={event => onChangeCapabilityCheckbox?.(event, item.id)}
      readOnly={readOnly}
      checked={isCapabilitySelected(item.id) && action === item.action}
    />;
  };

  const resultsFormatter = {
    application: item => getApplicationName(item.applicationId),
    resource: item => item.resource,
    view: item => renderItemActionCheckbox(item, 'view'),
    edit: item => renderItemActionCheckbox(item, 'edit'),
    manage: item => renderItemActionCheckbox(item, 'manage'),
    // policies: (item) => <Badge>{item.policiesCount}</Badge>
  };

  return <div data-testid="capabilities-settings-type" className={css.gutterTop}>
    <Headline size="large" margin="none" tag="h3">
      <FormattedMessage id="ui-authorization-roles.details.settings" />
    </Headline>
    <MultiColumnList
      interactive={false}
      columnMapping={columnMapping}
      formatter={resultsFormatter}
      contentData={content}
      visibleColumns={['application', 'resource', 'view', 'edit', 'manage', '']}
      columnWidths={{ application: '40%', resource: '36%', view: '6%', edit: '6%', manage: '6%' }}
    />
  </div>;
};

CapabilitiesSettings.propTypes = { content: capabilitiesPropType,
  readOnly: PropTypes.bool,
  onChangeCapabilityCheckbox: PropTypes.func,
  isCapabilitySelected: PropTypes.func };

export { CapabilitiesSettings };
