import { render, screen } from "@testing-library/react";
import { NavBar } from "./index";

describe("<NavBar />", () => {
  it("should render component", () => {
    render(<NavBar />);
    expect(screen.getByTestId("navbar")).toMatchSnapshot();
  });

  it("should have website name", () => {
    render(<NavBar />);
    expect(screen.getByTestId("navbar")).toHaveTextContent("Red Moon");
  });
});
