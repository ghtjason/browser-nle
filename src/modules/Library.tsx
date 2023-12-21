import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { IconButton, Icon } from "@chakra-ui/react";
import {
  IconSquarePlus,
  IconFolder,
  IconSquareLetterT,
} from "@tabler/icons-react";

function Sections() {
  return (
    <>
      <Tabs variant="soft-rounded" orientation="vertical" ml={3} height="100%">
        <TabList aria-orientation="vertical">
          <Tab mt={5}>
            <Icon as={IconFolder} boxSize={"1.5em"} />
          </Tab>
          <Tab mt={3}>
            <Icon as={IconSquareLetterT} boxSize={"1.5em"} />
          </Tab>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <IconButton
              aria-label="Add files"
              icon={<IconSquarePlus />}
              mb={3}
            />
          </div>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              iaculis convallis felis, at vehicula diam pretium sed. Quisque
              feugiat aliquam ornare. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Vestibulum vulputate non diam id tempus.
              Suspendisse eu consectetur lectus. Sed sodales rhoncus felis sed
              porta. Integer et ullamcorper tortor. Nam erat ipsum, semper eget
              varius congue, suscipit vel lacus. Morbi a varius neque.
              Suspendisse arcu mauris, iaculis eu augue nec, fermentum posuere
              nisi. Nunc bibendum volutpat eros quis maximus. Vestibulum
              vestibulum non turpis quis cursus. Nam erat urna, tempor ut lectus
              ac, pulvinar venenatis orci. Vivamus venenatis, est fermentum
              egestas rutrum, orci velit faucibus tellus, ultricies scelerisque
              tellus sem in mauris. In hac habitasse platea dictumst.
              Pellentesque porttitor tempor sapien, eu vestibulum purus gravida
              maximus. Aliquam eros sem, imperdiet eu varius id, volutpat at
              turpis. Maecenas in auctor elit, venenatis blandit ligula. Ut
              cursus facilisis tellus sit amet malesuada. Quisque hendrerit dui
              eros, sed hendrerit ante sollicitudin condimentum. Phasellus ut
              dolor et ipsum blandit eleifend vel sit amet dolor. Vivamus vel
              ante vitae leo efficitur laoreet. Donec laoreet nisl tellus, nec
              fringilla massa commodo eu. Quisque a aliquam ante. Duis non diam
              non magna laoreet rutrum sit amet ut mauris. Integer porta posuere
              vestibulum. Phasellus lobortis ante et purus aliquam malesuada.
              Etiam nunc felis, cursus in erat non, aliquam sodales velit.
              Curabitur scelerisque lorem augue, tincidunt consectetur augue
              ultricies ac. Ut sed cursus lorem, non bibendum enim. Mauris
              ultrices interdum rhoncus. In hac habitasse platea dictumst. Fusce
              feugiat accumsan justo, eu finibus diam pellentesque ac.
              Pellentesque dapibus, leo ut gravida condimentum, elit dui iaculis
              metus, quis vestibulum quam ligula et erat. Etiam aliquam eget
              sapien vel placerat. Donec eget dui sollicitudin, pellentesque
              arcu eget, volutpat lacus. Sed et vehicula ex, ut fermentum felis.
              Phasellus ultrices, turpis non convallis scelerisque, tortor
              lectus laoreet metus, sit amet auctor neque ante in quam. Aliquam
              scelerisque, sem id dictum tempus, risus odio malesuada quam, ac
              fermentum nibh turpis vitae orci. Integer finibus leo diam, ut
              faucibus neque pharetra non. Aenean risus diam, gravida sit amet
              lectus sed, pellentesque dictum sapien. Morbi condimentum urna
              quis porttitor blandit. Maecenas vestibulum diam ut velit pretium,
              at dapibus lacus aliquet. Mauris non urna nisi. Donec sollicitudin
              tempus felis at condimentum. Nunc sit amet ligula et justo mattis
              vestibulum ac vel orci. Morbi egestas sollicitudin felis vel
              consequat. Aenean efficitur, justo et sagittis egestas, mauris
              quam ultrices tortor, in condimentum mauris orci id nisl. Etiam
              non feugiat mauris. In at nibh lacus. Mauris cursus quam ipsum.
              Proin laoreet, nisi rhoncus ultricies eleifend, tellus nulla
              gravida odio, sit amet rutrum orci orci vitae felis. Nam tempus,
              tortor ut tristique sagittis, sem sapien tempus felis, nec
              fringilla libero est eu quam. Morbi venenatis sapien at sapien
              porttitor, nec sodales arcu tincidunt. Pellentesque habitant morbi
              tristique senectus et netus et malesuada fames ac turpis egestas.
              Suspendisse at tempor nunc, ac euismod augue. Nullam rhoncus leo
              metus. Duis ultricies sit amet purus eu eleifend. Sed leo orci,
              mollis at sagittis ut, laoreet quis arcu. Vivamus non ex vel diam
              hendrerit ullamcorper.{" "}
            </p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default function Library() {
  return <Sections />;
}
