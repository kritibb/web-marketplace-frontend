import { useRouter } from "next/router";
import useSWR from "swr";
import { del_fetcher, get_fetcher } from "@/fetch";
import { ProductCard } from "@/components/Shop/Shop";
import { useSession } from "next-auth/react";
import jwtDecode from "jwt-decode";
import { DecodedToken } from "@/components/UserProfile/UserProfile";

const Post = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const { id } = router.query;
  var decodedData: DecodedToken = {
    exp: 0,
    iat: 0,
    jti: "",
    token_type: "",
    user_id: 0,
  };
  if (session) {
    decodedData = jwtDecode(session.user?.access);
  }

  const DeleteProduct = (event: any) => {
    event.preventDefault();
  const res = del_fetcher(`products/${id}`, session)

    router.push({
      pathname: "/shop",
    });
  };

  const editProduct = (event: any) => {
    event.preventDefault();
    router.push({
      pathname: "/add-products",
      query: { id: id },
    });
  };

  const { data, error } = useSWR(`products/${id}`, get_fetcher);
  if (!data) return <h1>I am loading</h1>;
  else if (error) return <h1>there is error</h1>;
  else {
    if (decodedData.user_id==data.product_author){
      return (
        <>
          <div className="mt-16 mb-20">
            <ProductCard product={data} />
            <div className="flex flex-rows justify-evenly my-10">
              <Button func={editProduct} text="Edit" color="blue" />
              <Button func={DeleteProduct} text="Delete" color="red" />
            </div>
          </div>
        </>
      );

    }
    else{
      return (
        <>
          <div className="mt-16 mb-20">
            <ProductCard product={data} />
          </div>
        </>
      );

    }
  }
};

const Button = ({
  func,
  text,
  color,
}: {
  func: any;
  text: string;
  color: string;
}) => {
  return (
    <div>
      <button
        onClick={func}
        className={`bg-${color}-500 hover:bg-${color}-700 w-32 sm:w-44 text-white font-bold py-4 text-xl px-4 border border-${color}-700 rounded`}
      >
        {text}
      </button>
    </div>
  );
};

export default Post;
