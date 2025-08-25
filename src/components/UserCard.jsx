import React from "react";

const UserCard = ({ user }) => {
  return (
    <div>
      <div className="card bg-base-300 w-96 shadow-sm">
        <figure>
          <img src={user?.photo} alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {user?.firstName} {user?.lastName}
          </h2>
          <p>
            {user?.age && user?.gender && (
              <>
                {user.age} {user.gender}
              </>
            )}
          </p>
          <p>
            {user?.about} some text i want to add to the about section just to
            see how it looks
          </p>
          <div className="card-actions justify-end">
            <div className="flex justify-center gap-4 w-full mt-2">
              <button className="btn btn-primary mx-2">Ignore</button>
              <button className="btn btn-secondary mx-2">Interested</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
