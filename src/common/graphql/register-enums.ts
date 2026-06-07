import { registerEnumType } from '@nestjs/graphql';
import {
  AppointmentMode,
  AppointmentStatus,
  Gender,
  MealType,
  NotificationType,
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

registerEnumType(MealType, {
  name: 'MealType',
});

registerEnumType(NotificationType, {
  name: 'NotificationType',
});
