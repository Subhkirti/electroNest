import React from "react";
import AppStrings from "../appStrings";

function NoResultsFound() {
  return (
    <div className="text-slate-400 flex justify-center items-center p-20 text-3xl font-bold">
      {AppStrings.resultsNotFound}
    </div>
  );
}

export default NoResultsFound;
