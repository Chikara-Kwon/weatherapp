import ProvinceList from "../../components/ProvinceList";
import WeatherAPI from "../../components/WeatherAPI";
import User from "@/app/user/page";

export default function Home() {
  return (
    <div>
      <WeatherAPI />
    </div>
  );
}
