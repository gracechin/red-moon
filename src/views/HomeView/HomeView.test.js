import { render, screen } from "@testing-library/react";
import { HomeView } from "./index";

describe("<HomeView />", () => {
  it("should render view", () => {
    render(<HomeView />);
    expect(screen.getByTestId("home-view")).toMatchSnapshot();
  });

  it("should render navbar", () => {
    const { getByTestId } = render(<HomeView />);
    expect(getByTestId("navbar")).toMatchSnapshot();
  });
});
