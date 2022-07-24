import ReactDom from 'react-dom'

export default function Modal({ children }) {
  return ReactDom.createPortal(
    <>
      <div className="fixed h-full w-full w- bg-black opacity-50 "></div>
      <div className="fixed  p-3 bg-white z-50 overflow-auto">
        {children}
      </div>
    </>,
    document.getElementById("portal")
  );
}
