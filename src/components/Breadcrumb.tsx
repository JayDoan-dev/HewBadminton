"use client";

import Link from "next/link";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

const Breadcrumb = ({
  items,
  linkClassName = "text-blue-600 hover:underline",
}: {
  items: BreadcrumbItem[];
  linkClassName?: string;
}) => {
  return (
    <nav className="text-sm text-gray-600 mt-8">
      <ol className="list-reset flex flex-wrap">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {idx === items.length - 1 ? (
              <span className="text-gray-600 font-medium">{item.name}</span>
            ) : item.href ? (
              <Link href={item.href} className={linkClassName}>
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-800">{item.name}</span>
            )}

            {idx < items.length - 1 && <span className="mx-2">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
