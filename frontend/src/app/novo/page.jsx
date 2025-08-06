'use client';
import './novo.css';
import Header from '@/components/Header/header';

export default function Chamados() {
    
    return (
      <div className="d-flex">
        <Header />
        <div className="container">
  {/* Form */}
  <form className="js-validate">
    <div className="form-row">
      <div className="col-sm-6 mb-sm-3">
        <div className="js-form-message form-group">
          <label className="input-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="inputName"
            placeholder="Name"
            aria-label="Name"
            required=""
            data-msg="Please enter your name."
          />
        </div>
      </div>
      <div className="col-sm-6 mb-sm-3">
        <div className="js-form-message form-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="emailAddress"
            id="emailAddress"
            placeholder="Email address"
            aria-label="Email address"
            required=""
            data-msg="Please enter a valid email address."
          />
        </div>
      </div>
      <div className="col-12 mb-sm-3">
        <div className="js-form-message form-group">
          <label className="input-label">Comment</label>
          <textarea
            className="form-control"
            rows={7}
            id="descriptionTextarea"
            placeholder="Comment"
            required=""
            data-msg="Please enter your message."
            defaultValue={""}
          />
        </div>
      </div>
    </div>
    <div className="d-flex justify-content-center">
      <button
        type="submit"
        className="btn btn-primary btn-wide transition-3d-hover"
      >
        Submit
      </button>
    </div>
  </form>
  {/* End Form */}
</div>

    
      </div>
    );
  }