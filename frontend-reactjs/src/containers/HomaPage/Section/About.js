import React, { Component } from "react";
import { connect } from "react-redux";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-about-header">
          Truyền thông nói về Trị Nguyễn
        </div>
        <div className="section-about-content">
          <div className="content-left">
            <iframe
              width="100%"
              height="400px"
              src="https://www.youtube.com/embed/f7kD3Sr-qDQ"
              title="Thầy ba cười"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="content-right">
            <p>
              RED BULL VỊ CÀ PHÊ Ủ LẠNH MỚI - CHÍNH THỨC ĐỔ BỘ Bạn đã sẵn sàng
              bùng nổ cùng hương vị cà phê ủ lạnh độc đáo của Red Bull? Ngay từ
              ngụm đầu tiên, Red Bull Vị Cà Phê Ủ Lạnh sẽ lập tức up mood, cho
              bạn thêm sảng khoái và tràn đầy hứng khởi.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
