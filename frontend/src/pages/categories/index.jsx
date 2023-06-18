import { Box, Divider, Text } from "@chakra-ui/react";

const CategoryList = ({ categories }) => {
  // Group categories by alphabetical first letter
  const groupedCategories = {};
  categories.forEach((category) => {
    const firstLetter = category.charAt(0).toUpperCase();
    if (groupedCategories[firstLetter]) {
      groupedCategories[firstLetter].push(category);
    } else {
      groupedCategories[firstLetter] = [category];
    }
  });

  // Render the category list
  return (
    <>
      <NextSeo
        title={`Cursos - ${siteConfig?.title}`}
        description={siteConfig?.description}
        canonical={siteConfig?.url}
        openGraph={{
          url: siteConfig?.url,
          title: siteConfig?.title,
          description: siteConfig?.description,
          images: [
            {
              url: siteConfig?.image,
              width: 800,
              height: 600,
              alt: siteConfig?.title,
            },
          ],
          site_name: siteConfig?.title,
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Box>
          {Object.keys(groupedCategories).map((letter) => (
            <Box key={letter}>
              <Divider mt={2} mb={1} />
              <Text fontWeight="bold" fontSize="lg" mt={2}>
                {letter}
              </Text>
              {groupedCategories[letter].map((category) => (
                <Text key={category}>{category}</Text>
              ))}
            </Box>
          ))}
        </Box>
      </Layout>
    </>
  );
};

export default CategoryList;

// get static props with page info from backend
export async function getServerSideProps({ query, req, res }) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.expires * 1000 < Date.now()) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    const menuItems = await getMenuItems(session?.user?.accessToken);
    const categories = await getCategories(session?.user?.accessToken);
  
    const { page, search } = query;
    const params = {
      page: parseInt(page) || 1,
      search: search || null,
    };
  
    const coursesItems = await getCoursesFromServer(
      session?.user?.accessToken,
      params
    );
  
    return {
      props: {
        categories,
        menuItems,
        canCreate: coursesItems?.canCreate || false,
        params,
      },
    };
  }