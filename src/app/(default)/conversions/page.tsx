import { metadata as routeMetadata } from './layout';
export const metadata = routeMetadata;

import React from 'react';
import MeasurementConversionsClient from '@/components/conversions/MeasurementConversionsClient';
import { getConversionsCopy } from '@/i18n/pages/conversions';

export default function MeasurementConversionsPage() {
  return <MeasurementConversionsClient copy={getConversionsCopy('en')} />;
}
