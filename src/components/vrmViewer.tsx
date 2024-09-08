import homeStore from "@/features/stores/home";
import { buildUrl } from "@/utils/buildUrl";
import { useCallback } from "react";

export default function VrmViewer() {
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        // const { viewer } = useContext(ViewerContext);
        const { viewer } = homeStore.getState()
        viewer.setup(canvas);
        // viewer.loadVrm(buildUrl("/AvatarSample_B.vrm"));
        // viewer.loadVrm(buildUrl("/ainendorothy_20230219.vrm"));
        viewer.loadVrm(buildUrl("/Zundamon_chibi_v13r3_h130.vrm"));
        //viewer.loadVrm(buildUrl("Zundamon(Human)_VRM_09.vrm"));
        // viewer.loadVrm(buildUrl("にしの_8318292121722907199.vrm"));

        // Drag and DropでVRMを差し替え
        canvas.addEventListener("dragover", function (event) {
          event.preventDefault();
        });

        canvas.addEventListener("drop", function (event) {
          event.preventDefault();

          const files = event.dataTransfer?.files;
          if (!files) {
            return;
          }

          const file = files[0];
          if (!file) {
            return;
          }

          const file_type = file.name.split(".").pop();
          const blob = new Blob([file], { type: "application/octet-stream" });
          const url = window.URL.createObjectURL(blob);
          if (file_type === "vrm") {
            // const blob = new Blob([file], { type: "application/octet-stream" });
            // const url = window.URL.createObjectURL(blob);
            viewer.loadVrm(url);
          } else if (file_type === "vrma") {
            viewer.loadVrma(url);
          } else if (file_type === "bvh") {
            viewer.loadBvh(url);
          } else if (file_type === "fbx") {
            viewer.loadFbx(url);
          }
        });
      }
    }, []
  );

  return (
    <div className={"absolute top-0 left-0 w-screen h-[100svh] z-5"}>
      <canvas ref={canvasRef} className={"h-full w-full"}></canvas>
    </div>
  );
}
