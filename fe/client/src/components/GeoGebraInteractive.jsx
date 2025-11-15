import React, { useEffect, useRef } from "react";
import "./GeoGebraInteractive.css";

/**
 * Props:
 *  - materialId: (string) id của GeoGebra material (ví dụ "abcd1234")
 *  - base64: (string) nội dung .ggb encode base64 (thay cho materialId)
 *  - width: (string|number) ví dụ "100%" hoặc 800
 *  - height: (number) ví dụ 500
 *  - appName: (string) "classic" | "graphing" | ...
 *  - showToolbar, showAlgebraInput, showMenuBar: booleans
 */
export default function GeoGebraInteractive({
  materialId,
  base64,
  width = "100%",
  height = 500,
  appName = "classic",
  showToolbar = true,
  showAlgebraInput = false,
  showMenuBar = false,
  containerId,
}) {
  const wrapperRef = useRef(null);
  const id = containerId || `ggb-${Math.random().toString(36).slice(2, 9)}`;

  useEffect(() => {
    let mounted = true;

    function ensureScriptLoaded() {
      return new Promise((resolve, reject) => {
        if (window.GGBApplet) return resolve();
        const existing = document.querySelector('script[data-ggb="deploy"]');
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () =>
            reject(new Error("Không thể tải deployggb.js"))
          );
          return;
        }
        const s = document.createElement("script");
        s.src = "https://www.geogebra.org/apps/deployggb.js";
        s.async = true;
        s.setAttribute("data-ggb", "deploy");
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Không thể tải deployggb.js"));
        document.head.appendChild(s);
      });
    }

    (async () => {
      try {
        await ensureScriptLoaded();
        if (!mounted) return;

        const params = {
          appName,
          width,
          height,
          showToolbar,
          showAlgebraInput,
          showMenuBar,
          useBrowserForJS: true,
        };

        if (materialId) params.material_id = materialId;
        if (base64) params.ggbBase64 = base64;

        // create and inject
        // eslint-disable-next-line no-undef
        const app = new window.GGBApplet(params, true);
        // inject vào div có id = id
        app.inject(id);

        // expose instance để có thể truy cập nếu cần (ví dụ wrapperRef.current.app)
        if (wrapperRef.current) wrapperRef.current._ggbInstance = app;
      } catch (err) {
        console.error("GeoGebra load error:", err);
      }
    })();

    return () => {
      mounted = false;
      // cleanup: xóa nội dung container để tránh duplicate khi unmount/remount
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    };
  }, [
    materialId,
    base64,
    width,
    height,
    appName,
    showToolbar,
    showAlgebraInput,
    showMenuBar,
    id,
  ]);

  return (
    <div className="ggb-wrapper" ref={wrapperRef} style={{ width }}>
      <div id={id} style={{ width: "100%", height }} />
    </div>
  );
}