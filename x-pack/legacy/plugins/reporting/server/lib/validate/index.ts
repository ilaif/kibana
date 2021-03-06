/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { i18n } from '@kbn/i18n';
import { ElasticsearchServiceSetup } from 'kibana/server';
import { Logger } from '../../../types';
import { HeadlessChromiumDriverFactory } from '../../browsers/chromium/driver_factory';
import { ReportingConfig } from '../../types';
import { validateBrowser } from './validate_browser';
import { validateMaxContentLength } from './validate_max_content_length';

export async function runValidations(
  config: ReportingConfig,
  elasticsearch: ElasticsearchServiceSetup,
  browserFactory: HeadlessChromiumDriverFactory,
  logger: Logger
) {
  try {
    await Promise.all([
      validateBrowser(browserFactory, logger),
      validateMaxContentLength(config, elasticsearch, logger),
    ]);
    logger.debug(
      i18n.translate('xpack.reporting.selfCheck.ok', {
        defaultMessage: `Reporting plugin self-check ok!`,
      })
    );
  } catch (err) {
    logger.error(err);
    logger.warning(
      i18n.translate('xpack.reporting.selfCheck.warning', {
        defaultMessage: `Reporting plugin self-check generated a warning: {err}`,
        values: {
          err,
        },
      })
    );
  }
}
