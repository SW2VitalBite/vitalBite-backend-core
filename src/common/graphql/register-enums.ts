import { registerEnumType } from '@nestjs/graphql';
import {
  AppointmentMode,
  AppointmentStatus,
  Gender,
  PatientStatus,
  TenantStatus,
  UserStatus,
} from '../../prisma/generated-client';

registerEnumType(AppointmentStatus, {
  name: 'AppointmentStatus',
});

registerEnumType(AppointmentMode, {
  name: 'AppointmentMode',
});

registerEnumType(TenantStatus, {
  name: 'TenantStatus',
});

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(PatientStatus, {
  name: 'PatientStatus',
});

registerEnumType(Gender, {
  name: 'Gender',
});
