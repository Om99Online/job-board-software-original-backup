import React, { useState, useEffect } from "react";

const RoleGroup = ({ title, roles, onChange }) => {
  const [checkedState, setCheckedState] = useState({});

  useEffect(() => {
    // If the parent role is checked, check all child roles
    if (checkedState[title]) {
      const updatedState = roles.reduce((acc, role) => {
        acc[role] = true;
        return acc;
      }, {});
      setCheckedState((prevState) => ({
        ...prevState,
        ...updatedState,
      }));
    } else {
      // If the parent role is unchecked, uncheck all child roles
      const updatedState = roles.reduce((acc, role) => {
        acc[role] = false;
        return acc;
      }, {});
      setCheckedState((prevState) => ({
        ...prevState,
        ...updatedState,
      }));
    }
  }, [checkedState, roles, title]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));

    if (name === title) {
      // If the parent role is checked, set all child roles to the same state
      const updatedState = roles.reduce((acc, role) => {
        acc[role] = checked;
        return acc;
      }, {});
      setCheckedState((prevState) => ({
        ...prevState,
        ...updatedState,
      }));
    } else {
      // If a child role is checked or unchecked, update the parent role accordingly
      const allChildChecked = roles.every((role) => checkedState[role]);
      setCheckedState((prevState) => ({
        ...prevState,
        [title]: allChildChecked,
      }));
    }
  };

  return (
    <div className="parentRole">
      <input
        type="checkbox"
        id={title}
        className="checkBox"
        name={title}
        checked={checkedState[title] || false}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={title}>{title}</label>
      <div className="childRole">
        {roles.map((role) => (
          <div key={role}>
            <input
              type="checkbox"
              id={role}
              className="checkBox"
              name={role}
              checked={checkedState[role] || false}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={role}>{role}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleGroup;
