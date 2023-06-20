import { FiX } from "react-icons/fi";

interface ThumbnailsProps {
  previews: string[];
  selectedFiles: File[];
  removeFile: (index: number) => void;
}

const PetImageThumbs = ({
  previews,
  selectedFiles,
  removeFile,
}: ThumbnailsProps) => {
  const maxPreviewRows = 2; // Maximum number of rows for image previews
  const thumbsContainerStyles = `max-h-${maxPreviewRows * 14}`;

  return (
    <aside
      className={`flex flex-wrap gap-2 mb-4 w-full ${thumbsContainerStyles}`}
    >
      {selectedFiles.map((file, index) => (
        <div key={file.name} className="flex flex-row gap-2 relative ">
          <div className="text-xs">
            <img
              src={previews[index]}
              className="w-14 h-14 object-cover border-2 border-primary rounded"
              alt="preview"
            />
            <button
              className="absolute top-0 right-0 bg-slate-200 bg-opacity-50 hover:bg-slate-300 hover:bg-opacity-50 text-slate-100 rounded-l p-0.5"
              onClick={() => removeFile(index)}
            >
              <FiX className="h-3 w-3 " />
            </button>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default PetImageThumbs;
