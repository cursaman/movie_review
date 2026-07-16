export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="state-box state-box--error" role="alert">
      <strong>데이터를 불러오지 못했습니다.</strong>
      <p>{message}</p>
      {onRetry && (
        <button className="button button--primary" type="button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
