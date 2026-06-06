import { registerEnumType } from '@nestjs/graphql';
import {
  AppointmentMode,
  AppointmentStatus,
  DietPlanStatus,
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

registerEnumType(DietPlanStatus, {
  name: 'DietPlanStatus',
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
