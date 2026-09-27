/** Hidden from people and screen readers; bots fill it in, and the server quietly drops those submissions. */
export function HoneypotField({ id }: { id: string }) {
  return (
    <div className="honeypot" aria-hidden="true">
      <label htmlFor={id}>Leave this field empty</label>
      <input id={id} name="leaveBlank" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
