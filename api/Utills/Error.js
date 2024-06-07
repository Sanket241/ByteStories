export const Errorhandler= (StatusCode, Message) => {
    const error = new Error();
    error.StatusCode = StatusCode;
    error.message = Message;
    return error;
}