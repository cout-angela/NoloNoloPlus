import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import { handle } from './../errHandler';
import axios from 'axios';

const Profile = ({ customer, updateCustomer }) => {
    const navigate = useNavigate();
    const [isReadonly, setReadonly] = useState(true);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [samePassword, setSamePassword] = useState(false);
    const [usedUsername, setUsedUsername] = useState(false);





    async function logOut(e) {
        e.preventDefault();
        await fetch('/api/customer/logout', {
            method: "DELETE"
        });
        window.location.reload(false);
    }
    function editProfile() {
        setReadonly(!isReadonly);
        setForm({avatar: customer.avatar})
    }

    // PROFILE FORM AND SUBMISSION
    const [form, setForm] = useState({
        avatar: "",
        username: "",
        name: "",
        surname: ""
    });

    // These methods will update the state properties.
    async function loadAvatar(img) {
        //load the avatar, first store it in formdata
        var data = new FormData();
        if (!img) return console.log('no images');
        for (let i = 0; i < img.length; i++) {
            data.append('imgs', img[i]);
        }

        //load the new avatar and return it
        var imgString = await axios.post("/api/imgs/upload", data, {})
        return (imgString.data[0]);
    }

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    useEffect(() => {

        setForm({ username: customer.username, name: customer.name, surname: customer.surname, avatar: customer.avatar });

    }, [customer])

    // This function will handle the submission.
    async function saveProfile(e) {
        e.preventDefault();

        // When a post request is sent to the create url, we'll add a new record to the database.
        const updatedCustomer = { ...form };

        await fetch('/api/customer/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCustomer),
        })
            .then(async response => {
                var data = await response.json();
                var answer = handle(data)
                if (answer.command === 'displayErr') {
                    if (answer.msg === 'banned') {
                        alert('you have been banned');
                        window.location.reload(false);
                    }
                    if (answer.msg === 'usernameAlreadyInUse') {
                        setUsedUsername(true);
                    }

                } else if (answer === 'loggedOut') {
                    window.location.reload(false);
                } else {
                    //delete old avatar if it existed
                    if (customer.avatar) axios.delete('/api/imgs/' + customer.avatar, {}, {});
                    updateCustomer(answer);
                    setForm({ username: customer.username, name: customer.name, surname: customer.surname, avatar: customer.avatar });
                    setReadonly(true);

                }

            })
            /*.then(data => {
              console.log('Success:', data);
              
            })*/
            .catch((error) => {
                handle(error);
            });



    }

    // PASSWORD FORM AND SUBMISSION
    const [passForm, setPassForm] = useState({
        oldPassword: '',
        newPassword: ''
    });

    // These methods will update the state properties.
    function updatePassForm(value) {
        return setPassForm((prev) => {
            return { ...prev, ...value };
        });
    }
    // This function will handle the submission.
    async function updatePassword(e) {
        e.preventDefault();

        // When a post request is sent to the create url, we'll add a new record to the database.
        const passwords = { ...passForm };

        await fetch('/api/customer/updatePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwords),
        })
            .then(async response => {
                var data = await response.json();
                var answer = handle(data)
                if (answer.command === 'displayErr') {
                    if (answer.msg === 'banned') {
                        alert('you have been banned');
                        window.location.reload(false);
                    }
                    if (answer.msg === 'samePass') {
                        setSamePassword(true);
                        setWrongPassword(false);
                        setPassForm({ oldPassword: '', newPassword: '' });
                    } if (answer.msg === 'wrongPass') {
                        setSamePassword(false);
                        setWrongPassword(true);
                        setPassForm({ oldPassword: '', newPassword: '' });
                    }

                } else {
                    window.location.reload(false);

                }




            })
            /*.then(data => {
              console.log('Success:', data);
              
            })*/
            .catch((error) => {
                handle(error);
            });
        setReadonly(true);

    }
    return (

        <>
            <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <div className="row nolonoloFullWidth p-3">
                    <div className="col d-flex justify-content-end">
                        <button className="btn nolonoloYellowBackground nolonoloWhiteText" onClick={logOut}>LOG OUT</button>
                    </div>
                </div>
                <form id="profileForm" onSubmit={saveProfile} className='d-flex flex-column'>
                    <div class="container m-0 p-0 avatarDiv">
                        <img src={"/api/imgs/" + form.avatar} alt="avatar" className='avatarImg' />
                    </div>
                    <div className="row nolonoloFullWidth p-2 justify-content-center">
                        <div className="col-6">
                            <div className="mb-3 row">
                                <div className="col-6 d-flex justify-content-end">
                                    {!isReadonly && <label htmlFor="customer-avatar" className="nolonoloBoldText">Avatar</label>}
                                </div>
                                <div className="col-6">
                                    {!isReadonly && <input
                                        type="file"
                                        className="form-control"
                                        id="customer-avatar"
                                        onChange={async (e) => updateForm({ avatar: await loadAvatar(e.target.files) })}
                                    />}
                                    {!isReadonly && <p>Changing the username will log you out</p>}
                                    {usedUsername && <p className="nolonoloYellowText">Username already in use</p>}
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-6 d-flex justify-content-end">
                                    <label htmlFor="customer-username" className="nolonoloBoldText">Username</label>
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text"
                                        readOnly={isReadonly ? true : false}
                                        className="form-control"
                                        id="customer-username"
                                        value={form.username}
                                        onChange={(e) => updateForm({ username: e.target.value })}
                                    />
                                    {!isReadonly && <p>Changing the username will log you out</p>}
                                    {usedUsername && <p className="nolonoloYellowText">Username already in use</p>}
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-6 d-flex justify-content-end">
                                    <label htmlFor="customer-name" className="nolonoloBoldText">Name</label>
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text"
                                        readOnly={isReadonly ? true : false}
                                        className="form-control"
                                        id="customer-name"
                                        value={form.name}
                                        onChange={(e) => updateForm({ name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-6 d-flex justify-content-end">
                                    <label htmlFor="customer-surname" className="nolonoloBoldText">Surname</label>
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text"
                                        readOnly={isReadonly ? true : false}
                                        className="form-control"
                                        id="customer-surname"
                                        value={form.surname}
                                        onChange={(e) => updateForm({ surname: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-6 d-flex justify-content-end">
                                    <label htmlFor="customer-password" className="nolonoloBoldText">Password</label>
                                </div>
                                <div className="col-3">
                                    <input type="text" readOnly className="form-control" id="customer-password" defaultValue="&#8226;&#8226;&#8226;&#8226;" />
                                </div>
                                <div className="col-3">
                                    {!isReadonly && <button className="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="editcustomerPasswordBtn" data-bs-toggle="modal" data-bs-target="#changePasswordModal"> CHANGE PASSWORD </button>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 row justify-content-center">
                            <div className="col-3 d-flex justify-content-center">
                                <button type='button' className="btn nolonoloBackgroundNavSecond nolonoloWhiteText me-2" id="editcustomerBtn" onClick={editProfile} > EDIT </button>
                                {!isReadonly && <button className="btn nolonoloBackgroundNavSecond nolonoloWhiteText ms-2" id="savecustomerBtn" type="submit"> SAVE </button>}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header flex-column">
                            <h5 className="modal-title nolonoloFullWidth nolonoloBoldText" id="exampleModalLabel">Change your Password</h5>
                            <p className="nolonoloFullWidth" >Please note that after you change your password you will be logged out</p>
                        </div>
                        <form id="passwordForm" onSubmit={updatePassword}>
                            <div className="modal-body">
                                <label htmlFor="oldPassword" className="nolonoloBoldText">Old password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="oldPassword"
                                    defaultValue={passForm.oldPassword}
                                    onChange={(e) => updatePassForm({ oldPassword: e.target.value })}
                                />
                                {wrongPassword && <p className='nolonoloYellowText'>Incorrect password</p>}
                                <label htmlFor="newPassword" className="nolonoloBoldText">New password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    defaultValue={passForm.newPassword}
                                    onChange={(e) => updatePassForm({ newPassword: e.target.value })}
                                />
                                {samePassword && <p className='nolonoloYellowText'>The new password can't be same as the old password</p>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn nolonoloWhiteText nolonoloYellowBackground">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Profile
