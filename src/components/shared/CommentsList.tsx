import { useGetReplies } from "@/lib/react-query/queriesAndMutations";
import SingleCommentRepliesList from "./SingleCommentRepliesList"



//display single comment
const CommentsList = ({ comment }) => {
// console.log('comment id=>',comment);

  return (
    <div>
        { 
           comment?.documents.map((item) => (
            <SingleCommentRepliesList key={item.$id} item={item} />)
           )
        }
    </div>
  )
}

export default CommentsList