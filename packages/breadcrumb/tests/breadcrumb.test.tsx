import * as React from "react"
import { render } from "@chakra-ui/test-utils"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../src"

test("Breadcrumb renders correctly", () => {
  const { asFragment } = render(
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Link 1</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Link 2</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink>Link 3</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>,
  )
  expect(asFragment()).toMatchSnapshot()
})

test("has the proper aria-attributes", () => {
  const { getByText, getAllByRole, getByLabelText } = render(
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Link 1</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Link 2</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink>Link 3</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>,
  )

  // surrounding `nav` has aria-label="breadcrumb"
  getByLabelText("breadcrumb", { selector: "nav" })

  // `isCurrentPage` link has aria-current="page"
  const currentPageLink = getByText("Link 3")
  expect(currentPageLink).toHaveAttribute("aria-current", "page")

  // separator receives presentation="role"
  expect(getAllByRole("presentation")).toHaveLength(2)
})

test("seperator can be changed", () => {
  const { getAllByText } = render(
    <Breadcrumb separator="-">
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Link 1</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Link 2</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>,
  )
  expect(getAllByText("-")).toHaveLength(1)
})
