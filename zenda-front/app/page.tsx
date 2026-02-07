"use client";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();


  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <h1>Welcome to Zenda</h1>
      <h4>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum deleniti provident explicabo at esse corporis eius accusantium? Quisquam ducimus officiis molestiae accusantium quos doloremque ea, pariatur exercitationem, nobis debitis ad.
      Facilis vitae repellat delectus rem placeat provident dolor incidunt dolore veritatis sint autem maiores velit cumque quaerat illum a exercitationem beatae suscipit neque cum, ipsum esse ad! Repellendus, nulla quam?
      Velit, iure harum? Labore nihil perferendis tempore illo iure atque id eos blanditiis doloribus harum architecto quia corrupti obcaecati velit iusto aut itaque at, ut animi quae cupiditate beatae possimus!
      Beatae perferendis cum obcaecati exercitationem at omnis accusamus dignissimos pariatur eos impedit eaque possimus, error accusantium voluptate? Deleniti veniam autem enim ut, dolorum dolores eius at quos? Doloribus, error vel.
      Accusantium quibusdam obcaecati eaque consequuntur quis voluptatibus tempore soluta, placeat debitis iusto ut saepe nulla error? Illum quia unde mollitia. Illum suscipit aspernatur eius blanditiis, vel eaque similique officia illo?</h4>
      <button onClick={() => router.push("/login")}>Login</button>
    </div>
  );
}
