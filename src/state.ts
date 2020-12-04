import { ref, watch, } from 'vue'
import { nanoid } from 'nanoid'

const DEVICE_ID_LOCAL_STORAGE_KEY = 'device-id';

const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_LOCAL_STORAGE_KEY);
  if (deviceId) return deviceId;
  deviceId = nanoid();
  localStorage.setItem(DEVICE_ID_LOCAL_STORAGE_KEY, deviceId);
  return deviceId;
}

export const deviceId = ref(getDeviceId());

watch(deviceId, value => localStorage.setItem(DEVICE_ID_LOCAL_STORAGE_KEY, value));

// ---

const ACTIVITY_START_TIMESTAMP_SESSION_STORAGE_KEY = 'activity-start-timestamp';
const ACTIVITY_END_TIMESTAMP_SESSION_STORAGE_KEY = 'activity-end-timestamp';

const getActivityTimestamp = (key: string) => {
  const timestamp = sessionStorage.getItem(key);
  if (timestamp)
    return new Date(+timestamp);
  return null;
};

export const activityStartTimestamp = ref<Date | null>(getActivityTimestamp(ACTIVITY_START_TIMESTAMP_SESSION_STORAGE_KEY));
export const activityEndTimestamp = ref<Date | null>(getActivityTimestamp(ACTIVITY_END_TIMESTAMP_SESSION_STORAGE_KEY));

const updateActivity = (key: string) => (value: Date) => value === null
  ? sessionStorage.removeItem(key)
  : sessionStorage.setItem(key, +value + '');
watch(activityStartTimestamp, updateActivity(ACTIVITY_START_TIMESTAMP_SESSION_STORAGE_KEY));
watch(activityEndTimestamp, updateActivity(ACTIVITY_END_TIMESTAMP_SESSION_STORAGE_KEY));

export const startActivity = () => (activityStartTimestamp.value = new Date());
export const stopActivity = () => (activityEndTimestamp.value = new Date());

// ---

export const location = ref<[number, number] | null>(null);

export const getLocation = async () => new Promise((resolve, reject) =>
  navigator.geolocation.getCurrentPosition(
    pos => resolve(location.value = [pos.coords.latitude, pos.coords.longitude]),
    err => reject(err),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
)

