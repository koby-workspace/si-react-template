import { getStoredUserHistory } from "./mockUserHistoryStore.js";

export async function getUserHistory(params = {}) {
  const normalizedLoginId = params.loginId?.trim().toLowerCase();
  const normalizedName = params.name?.trim().toLowerCase();
  const normalizedActor = params.actor?.trim().toLowerCase();
  const startTime = params.startAt ? new Date(params.startAt).getTime() : null;
  const endTime = params.endAt ? new Date(params.endAt).getTime() : null;

  return getStoredUserHistory().filter((history) => {
    const matchesLoginId =
      !normalizedLoginId ||
      history.entityLoginId.toLowerCase().includes(normalizedLoginId);
    const matchesName =
      !normalizedName ||
      history.entityUserName.toLowerCase().includes(normalizedName);
    const matchesActor =
      !normalizedActor || history.actor.toLowerCase().includes(normalizedActor);
    const matchesAction = !params.action || history.action === params.action;
    const occurredTime = new Date(history.occurredAt).getTime();
    const matchesStartTime = startTime === null || occurredTime >= startTime;
    const matchesEndTime = endTime === null || occurredTime <= endTime;

    return (
      matchesLoginId &&
      matchesName &&
      matchesActor &&
      matchesAction &&
      matchesStartTime &&
      matchesEndTime
    );
  });
}
