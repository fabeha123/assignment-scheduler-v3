export default function AISuggestionSection({ aiSuggestion }) {
  if (!aiSuggestion) return null;

  return (
    <div className="w-full mt-6 p-4 bg-[#c4e7ff]/60 rounded-[13px] text-[#0068ae]">
      {aiSuggestion.suggested_end_date ? (
        <>
          <p className="font-bold">✨ Suggestions</p>
          <p className="text-[15px] font-light">
            Start Date:{" "}
            <span className="font-bold">
              {aiSuggestion.suggested_start_date}
            </span>
          </p>
          <p className="text-[15px] font-light">
            End Date:{" "}
            <span className="font-bold">{aiSuggestion.suggested_end_date}</span>
          </p>
          <p className="text-[15px] font-light">{aiSuggestion.reasoning}</p>
        </>
      ) : (
        <>
          <p className="text-[15px] font-light">
            {aiSuggestion.message || "No suggestion available."}
          </p>
          <p className="text-[15px] font-light">{aiSuggestion.reason || ""}</p>
        </>
      )}
    </div>
  );
}
