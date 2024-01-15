import CancelError from './CanceledError'
export default function isCancel(value: any): value is CancelError {
  return value && value instanceof CancelError
}
