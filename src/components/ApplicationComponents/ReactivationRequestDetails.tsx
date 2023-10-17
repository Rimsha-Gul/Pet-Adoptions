interface ReactivationRequestProps {
  reactivationRequest: {
    reasonNotScheduled: string
    reasonToReactivate: string
  }
}

const ReactivationRequestDetails = ({
  reactivationRequest
}: ReactivationRequestProps) => {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl text-primary font-bold mb-4 mt-2">
        Reactivation Request Details:
      </h2>
      <div className="border-b-2 border-gray-200 my-2"></div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start gap-4 sm:gap-10">
        <div
          key="Reason Not Scheduled"
          className="flex flex-col items-start gap-2"
        >
          <label className="text-gray-700 text-md sm:text-xl font-medium">
            Visit Not Scheduled Reason
          </label>
          <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
            {reactivationRequest.reasonNotScheduled}
          </p>
        </div>
        <div
          key="Reason To Reactivate"
          className="flex flex-col items-start gap-2"
        >
          <label className="text-gray-700 text-md sm:text-xl font-medium">
            Reactivation Reason
          </label>
          <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
            {reactivationRequest.reasonToReactivate}
          </p>
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 pt-8">
        <label className="text-gray-700 text-md sm:text-xl font-medium">
          Reason Not Scheduled:
        </label>
        <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
          {reactivationRequest.reasonNotScheduled}
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-8">
        <label className="text-gray-700 text-md sm:text-xl font-medium">
          Reason To Reactivate:
        </label>
        <p className="text-md sm:text-xl text-gray-600 whitespace-pre-line">
          {reactivationRequest.reasonToReactivate}
        </p>
      </div> */}
    </div>
  )
}

export default ReactivationRequestDetails
