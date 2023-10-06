import {
  useState,
  useEffect,
  ChangeEvent,
  useContext,
  FormEvent,
  useRef,
} from "react";
import api from "../api";
import { AppContext } from "../context/AppContext";
import loadingIcon from "../assets/loading.gif";
import { MdModeEditOutline } from "react-icons/md";
import { showSuccessAlert } from "../utils/alert";
import { useNavigate } from "react-router-dom";
import { User } from "../types/interfaces";
import { UserRole } from "../types/enums";

const UserProfile = () => {
  const appContext = useContext(AppContext);
  const userName = appContext.displayName;
  const userRole = appContext.userRole;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  const [nameError, setNameError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [isProfilePhotoRemoved, setIsProfilePhotoRemoved] =
    useState<boolean>(false);
  const [isNameEditable, setIsNameEditable] = useState<boolean>(false);
  const [isAddressEditable, setIsAddressEditable] = useState<boolean>(false);
  const [isBioEditable, setIsBioEditable] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    profilePhoto: "",
    name: "",
    email: "",
    address: "",
    bio: "",
  });
  const [prevUser, setPrevUser] = useState<User>({
    profilePhoto: "",
    name: "",
    email: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsFetching(true);
        const response = await api.get("/session");
        if (response.status === 200) {
          console.log(response.data);
          const userData = response.data;
          setUser({
            profilePhoto: userData.profilePhoto || "",
            name: userData.name || "",
            email: userData.email,
            address: userData.address || "",
            bio: userData.bio || "",
          });
          setPrevUser({
            profilePhoto: userData.profilePhoto || "",
            name: userData.name || "",
            email: userData.email,
            address: userData.address || "",
            bio: userData.bio || "",
          });
          console.log(user.profilePhoto);
          console.log(user.email);
          appContext.setProfilePhoto?.(response.data.profilePhoto);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setUser({ ...user, [field]: e.target.value });
    setNameError("");
    setAddressError("");
  };

  // Handler for clicking outside dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditIconClick = () => {
    console.log("clicked");
    setShowMenu(!showMenu);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setShowMenu(!showMenu);
      setNewProfilePhoto(e.target.files[0]);
      setUser({
        ...user,
        profilePhoto: URL.createObjectURL(e.target.files[0]),
      });
      setIsProfilePhotoRemoved(false);
    }
  };

  const removePhoto = () => {
    setShowMenu(!showMenu);
    setUser({ ...user, profilePhoto: "" });
    setNewProfilePhoto(null);
    setIsProfilePhotoRemoved(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validate name
    if (user.name.trim() === "" && prevUser.name.trim() !== "") {
      setNameError("Name field cannot be empty.");
      setIsLoading(false);
    }
    // Validate address
    if (user.address.trim() === "" && prevUser.address.trim() !== "") {
      setAddressError("Address field cannot be empty.");
      setIsLoading(false);
    }
    if (nameError === "" && addressError === "") {
      updateProfile();
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    let updates: Partial<User> = {};
    // Only update profilePhoto if newProfilePhoto is not null
    if (newProfilePhoto === null && isProfilePhotoRemoved) {
      updates.profilePhoto = "";
    } else if (newProfilePhoto) {
      updates.profilePhoto = newProfilePhoto;
    }

    if (user.name !== prevUser.name) updates.name = user.name;
    if (user.address !== prevUser.address) updates.address = user.address;
    if (user.bio !== prevUser.bio) updates.bio = user.bio;
    console.log(updates);
    if (Object.keys(updates).length > 0) {
      try {
        const formData = new FormData();
        for (const key in updates) {
          if (key === "profilePhoto" && updates[key]) {
            formData.append(key, updates[key as keyof User] as File);
          } else {
            formData.append(key, updates[key as keyof User] as Blob);
          }
        }
        if (isProfilePhotoRemoved) {
          formData.append(
            "removeProfilePhoto",
            isProfilePhotoRemoved.toString()
          );
        }

        console.log("formData");
        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }
        const response = await api.put("/auth/updateProfile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response.data);
        showSuccessAlert(response.data.message, undefined, () =>
          navigate("/userProfile")
        );
      } catch (error: any) {
        console.log(error);
      }
    }
    setIsLoading(false);
  };

  let imageSrc;
  if (user.profilePhoto) {
    imageSrc = user.profilePhoto as string;
  }

  return (
    <div className="bg-white flex justify-center pb-8">
      {isFetching ? (
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      ) : (
        <div className="w-2/3 md:w-1/2 flex flex-col items-center justify-center min-h-screen py-2">
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full mb-4">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Profile photo"
                className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-full mb-4 text-sm border-4 border-secondary shadow-md"
              />
            ) : (
              <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full mb-4 bg-gray-200 flex items-center justify-center border-4 border-secondary shadow-md">
                <span className="text-gray-500 text-5xl font-medium">
                  {userName.charAt(0)}
                </span>
              </div>
            )}

            <div className="absolute bottom-1 sm:bottom-2 left-3 sm:left-4 mt-2 mr-2 cursor-pointer text-primary bg-gray-50 rounded-md p-1 shadow-md">
              <MdModeEditOutline
                onClick={handleEditIconClick}
                className="text-xl sm:text-2xl"
              />
            </div>
            {showMenu && (
              <div
                ref={dropdownRef}
                className="absolute right-0 -mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              >
                <div
                  className="py-1 rounded-md bg-white shadow-xs divide-y"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Change Profile Photo
                  </button>
                  <button
                    onClick={removePhoto}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Remove Profile Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            data-cy="user-email"
            className="text-lg mb-20 bg-gray-100 rounded-full px-4 py-2"
          >
            {user.email}
          </div>

          <input
            type="file"
            id="profilePhoto"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />

          <div className="flex flex-col items-center justify-center w-full lg:w-3/4 xl:w-2/3 mb-8">
            <div className="flex w-full flex-col items-center mb-8">
              <div className="flex w-full flex-row justify-between">
                <label className="text-gray-700 font-medium text-lg mb-2">
                  Name:
                </label>
                <MdModeEditOutline
                  onClick={() => setIsNameEditable(!isNameEditable)}
                  className="text-2xl inline-block cursor-pointer text-primary"
                />
              </div>
              {isNameEditable ? (
                <input
                  value={user.name}
                  onChange={(e) => handleInputChange(e, "name")}
                  autoFocus
                  className="h-14 rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                />
              ) : (
                <div className="h-14 rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm">
                  {user.name}
                </div>
              )}
              <p className="text-red-500 text-xs mt-2">{nameError}</p>
            </div>

            <div className="flex w-full flex-col items-center mb-8">
              <div className="flex w-full flex-row justify-between">
                <label className="text-gray-700 font-medium text-lg mb-2">
                  Address:
                </label>
                <MdModeEditOutline
                  onClick={() => setIsAddressEditable(!isAddressEditable)}
                  className="text-2xl inline-block cursor-pointer text-primary"
                />
              </div>
              {isAddressEditable ? (
                <input
                  value={user.address}
                  onChange={(e) => handleInputChange(e, "address")}
                  autoFocus
                  className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                />
              ) : user.address ? (
                <div className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm">
                  {user.address}
                </div>
              ) : (
                <div className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-500 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm">
                  Your Street, Your City
                </div>
              )}
              <p className="text-red-500 text-xs mt-2">{addressError}</p>
            </div>

            <div className="flex w-full flex-col items-center">
              <div className="flex w-full flex-row justify-between">
                <label className="text-gray-700 font-medium text-lg">
                  Bio:
                </label>
                <MdModeEditOutline
                  onClick={() => setIsBioEditable(!isBioEditable)}
                  className="text-2xl inline-block cursor-pointer text-primary"
                />
              </div>
              {isBioEditable ? (
                <textarea
                  value={user.bio}
                  onChange={(e) => handleInputChange(e, "bio")}
                  autoFocus
                  rows={10}
                  className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                />
              ) : user.bio ? (
                <div className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm">
                  {user.bio}
                </div>
              ) : (
                <div className="rounded-md overflow-hidden text-overflow-ellipsis white-space-nowrap appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-500 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm">
                  {userRole === UserRole.User
                    ? "Your background, hobbies, and interests"
                    : `Your shelter's mission and the animals you care for`}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full lg:w-2/3 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary mt-10 ${
                isLoading ? "bg-primary text-white cursor-not-allowed" : ""
              } `}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading && (
                <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
              )}
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
