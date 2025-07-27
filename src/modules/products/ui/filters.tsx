import Categories from './categories';

function Filters() {
  //     await queryClient.refetchQueries({
  //   queryKey: ['posts', 1],
  //   type: 'active',
  //   exact: true,
  // })
  return (
    <div className="md:w-[20rem]">
      <h2 className="text-xl font-bold mb-8">Filters</h2>
      <div className="mb-12">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search products..."
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Categories
        </label>
        <div className="flex flex-wrap gap-3">
          <span
            onClick={() => {}}
            className="px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer hover:bg-gray-100"
          >
            All
          </span>

          <Categories />
        </div>
      </div>
    </div>
  );
}

export default Filters;
