const baseUrl = "";

export const createRecord = async <T>(
  path: string,
  payload: Partial<T>
): Promise<void> => {
  const logMsg = { payload };
  try {
    const { href } = new URL(`${baseUrl}${path}`);
    const response = await fetch(href);
    Object.assign(logMsg, { response });
  } catch (error) {
    Object.assign(logMsg, { error });
  } finally {
    console.log(JSON.stringify(logMsg));
  }
};
export const getRecords = async (path: string): Promise<Response | void> => {
  const logMsg = { path };
  try {
    const { href } = new URL(`${baseUrl}${path}`);
    const response = await fetch(href);
    Object.assign(logMsg, { response });
    return response;
  } catch (error) {
    Object.assign(logMsg, { error });
  } finally {
    console.log(JSON.stringify(logMsg));
  }
};

export const getRecord = async (
  path: string,
  id: string
): Promise<Response | void> => {
  const logMsg = { path, id };
  try {
    const { href } = new URL(`${baseUrl}${path}/${id}`);
    const response = await fetch(href);
    Object.assign(logMsg, { response });
    return response;
  } catch (error) {
    Object.assign(logMsg, { error });
  } finally {
    console.log(JSON.stringify(logMsg));
  }
};

export const updateRecord = async <T>(
  path: string,
  payload: Partial<T>
): Promise<Response | void> => {
  const logMsg = { payload };
  try {
    const { href } = new URL(`${baseUrl}${path}`);
    const response = await fetch(href);
    Object.assign(logMsg, { response });
    return response;
  } catch (error) {
    Object.assign(logMsg, { error });
  } finally {
    console.log(JSON.stringify(logMsg));
  }
};

export const deleteRecord = async (
  path: string,
  id: string
): Promise<Response | void> => {
  const logMsg = { path, id };
  try {
    const { href } = new URL(`${baseUrl}${path}`);
    const response = await fetch(href);
    Object.assign(logMsg, { response });
    return response;
  } catch (error) {
    Object.assign(logMsg, { error });
  } finally {
    console.log(JSON.stringify(logMsg));
  }
};
