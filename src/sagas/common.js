import { put, take, fork } from "redux-saga/effects";
import { types } from "../actions";

function* sendRequestStatus(type, request,meta) {
  yield put({
    type,
    payload: {
      type,
      request,
      meta
    }
  });
}

function* requestSuccessful(request,meta) {
  yield sendRequestStatus(types.REQUEST_SUCCESSFUL, request,meta);
}

// function* requestFailed(request) {
//   yield sendRequestStatus(types.REQUEST_FAILED, request);
// }

export function* request(type) {
  while (true) {
    const action = yield take(type);
    const payload = action.payload || {};

    yield put({ type: `${type}_DONE`, payload: payload });
    yield requestSuccessful(type,action.meta);
  }
}


export default function*() {
}
