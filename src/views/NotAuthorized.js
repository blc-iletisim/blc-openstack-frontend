import "@styles/base/pages/page-misc.scss";

const NotAuthorized = () => {
  return (
    <div className="misc-wrapper">
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">
            Bu sayfaya erişmek için yetkilendirilmediniz! 🔐
          </h2>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
